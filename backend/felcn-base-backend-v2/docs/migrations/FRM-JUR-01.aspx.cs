using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_FRM_JUR_01 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {        
        if (!IsPostBack)
        {
            String s = Request.QueryString["id"];
            buscaop(s.Trim());
            tipoestadocaso();
            ComboTipoDocum();
            Muestraarchivos();
            grados();
            Muestragrados();
            Muestrajuris();
            Muestraconjuris();
            listagrados();
            Muestraasignado();
            Muestraafiscal();
        }
    }
    private void buscaop(string valoridop)
    {
        string strSQLverif = "SELECT ASIGNACION.Casos_Id, ASIGNACION.NroCaso, ASIGNACION.NroOperativo, ASIGNACION.NombreCaso, ASIGNACION.AsigCaso, ASIGNACION.FiscalAsigCaso, ASIGNACION.NroCasoPerDom, ASIGNACION.IANUS, ETAPAINVEST.Descripcion, OPERATIVO.Op_Descripcion, OPERATIVO.Op_Id " +
                             "FROM ASIGNACION INNER JOIN ETAPAINVEST ON ASIGNACION.Eta_Inv = ETAPAINVEST.Eta_Inv INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                             "WHERE (ASIGNACION.Casos_Id = " + Convert.ToInt32(valoridop.Trim()) + ")";
        DataTable dtlista = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmdrev = new SqlCommand(strSQLverif);
        cmdrev.CommandType = CommandType.Text;
        cmdrev.Connection = SqlConn;
        SqlDataAdapter sdrev = new SqlDataAdapter(cmdrev);
        sdrev.Fill(dtlista);
        for (int i = 0; i < dtlista.Rows.Count; i++)
        {
            lblidcaso.Text = dtlista.Rows[i][0].ToString();
            txtnrocaso.Text = dtlista.Rows[i][1].ToString();
            txtnroop.Text = dtlista.Rows[i][2].ToString();
            txtnombrecaso.Text = dtlista.Rows[i][3].ToString();
            txtasignadocaso.Text = dtlista.Rows[i][4].ToString();
            txtfiscalasignado.Text = dtlista.Rows[i][5].ToString();
            txtperdom.Text = dtlista.Rows[i][6].ToString();
            lblcud.Text = dtlista.Rows[i][7].ToString();
            lbletapa.Text = dtlista.Rows[i][8].ToString();
            txtdetallehecho.Text = dtlista.Rows[i][9].ToString();
            lblidoperativo.Text = dtlista.Rows[i][10].ToString();
        }
        SqlConn.Close();
    }
    private void tipoestadocaso()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Eta_Inv, Descripcion FROM ETAPAINVEST";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        cboetapa.Items.Clear();
        cboetapa.ClearSelection();
        cboetapa.Items.Add("Seleccione Datos");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            cboetapa.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void btnactperdom_Click(object sender, EventArgs e)
    {
        string connectionString = ValoresGlobales.CONEXSIII;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            using (SqlCommand cmd = new SqlCommand("UPDATE ASIGNACION SET NroCasoPerDom = @NewNroCasoPerDom WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", conn))
            {
                cmd.Parameters.AddWithValue("@NewNroCasoPerDom", txtperdomact.Text.Trim().ToUpper());
                int rows = cmd.ExecuteNonQuery();
            }
            conn.Close();
        }
        txtperdomact.Text = "";
        buscaop(lblidcaso.Text.Trim());
        txtperdomact.Focus();
    }
    protected void btnactcud_Click(object sender, EventArgs e)
    {
        string connectionString = ValoresGlobales.CONEXSIII;
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            conn.Open();
            using (SqlCommand cmd = new SqlCommand("UPDATE ASIGNACION SET IANUS = @NewIANUS WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", conn))
            {
                cmd.Parameters.AddWithValue("@NewIANUS", txtcud.Text.Trim().ToUpper());
                int rows = cmd.ExecuteNonQuery();
            }
            conn.Close();
        }
        txtcud.Text = "";
        buscaop(lblidcaso.Text.Trim());
        txtcud.Focus();
    }

    protected void btnactetapa_Click(object sender, EventArgs e)
    {
        if (cboetapa.SelectedValue.Trim() != "Seleccione Datos")
        {
            string connectionString = ValoresGlobales.CONEXSIII;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE ASIGNACION SET Eta_Inv = @Eta_Inv WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", conn))
                {
                    cmd.Parameters.AddWithValue("@Eta_Inv", Convert.ToInt32(cboetapa.SelectedValue.Trim()));
                    int rows = cmd.ExecuteNonQuery();
                }
                conn.Close();
                tipoestadocaso();
                buscaop(lblidcaso.Text.Trim());
                cboetapa.Focus();
            }
        }
    }
    protected void btnactinforme_Click(object sender, EventArgs e)
    {
        if (txtdetallehecho.Text.Trim() != "")
        {
            string connectionString = ValoresGlobales.CONEXSIII;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE OPERATIVO SET Op_Descripcion = @Op_Descripcion WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", conn))
                {
                    cmd.Parameters.AddWithValue("@Op_Descripcion", txtdetallehecho.Text.Trim());
                    int rows = cmd.ExecuteNonQuery();
                }
                conn.Close();                
                buscaop(lblidcaso.Text.Trim());
                txtdetallehecho.Focus();
            }
        }
    }
    //PASO 2 Documentos
    private void ComboTipoDocum()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT ContCaso_Id, Descripcion FROM CONTENIDOCASO";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        Ddldescrip.ClearSelection();
        Ddldescrip.Items.Clear();
        Ddldescrip.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            Ddldescrip.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    protected void btnarchivo_Click(object sender, EventArgs e)
    {
        string getFileName;
        string contentType;
        if ((fudocum.PostedFile != null) && (fudocum.PostedFile.ContentLength > 0))
        {
            getFileName = fudocum.FileName.ToString();
            contentType = fudocum.PostedFile.ContentType;
            using (Stream fs = fudocum.PostedFile.InputStream)
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    byte[] bytes = br.ReadBytes((Int32)fs.Length);
                    using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
                    {
                        string query = "insert into ARCHIVOS values (@Casos_Id, @ContCaso_Id, @Tipo, @Nombre, @NombreArch, @Data)";
                        using (SqlCommand cmd = new SqlCommand(query))
                        {
                            cmd.Connection = con;
                            cmd.Parameters.AddWithValue("@Casos_Id", Convert.ToInt32(lblidcaso.Text.Trim()));
                            cmd.Parameters.AddWithValue("@ContCaso_Id", Convert.ToInt32(Ddldescrip.SelectedValue.Trim()));
                            cmd.Parameters.AddWithValue("@Tipo", ddltipodocumento.SelectedValue.Trim());
                            cmd.Parameters.AddWithValue("@Nombre", txtnombredoc.Text.Trim().ToUpper());
                            cmd.Parameters.AddWithValue("@NombreArch", getFileName.Trim());
                            cmd.Parameters.AddWithValue("@Data", bytes);
                            con.Open();
                            cmd.ExecuteNonQuery();
                            con.Close();
                        }
                    }
                }
            }
        }
        Muestraarchivos();
        limpiadoc();
    }
    private void limpiadoc()
    {
        ComboTipoDocum();
        txtnombredoc.Text = "";
        fudocum.Dispose();
        ddltipodocumento.SelectedIndex = ddltipodocumento.Items.IndexOf(ddltipodocumento.Items.FindByValue("DOCUMENTO"));
    }
    private void Muestraarchivos()
    {
        using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.CommandText = "SELECT ARCHIVOS.Arch_Id AS Id, CONTENIDOCASO.Descripcion AS A1, ARCHIVOS.Tipo AS A2, ARCHIVOS.Nombre AS A3, ARCHIVOS.NombreArch AS A4 FROM ARCHIVOS INNER JOIN CONTENIDOCASO ON ARCHIVOS.ContCaso_Id = CONTENIDOCASO.ContCaso_Id WHERE (ARCHIVOS.Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")";
                cmd.Connection = con;
                con.Open();
                griddocum.DataSource = cmd.ExecuteReader();
                griddocum.DataBind();
                con.Close();
            }
        }
    }
    protected void griddocum_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = griddocum.Rows[e.RowIndex].Cells[0].Text;
        deletearchivo(id);
        Muestraarchivos();
    }
    private void deletearchivo(string codigo)
    {
        string sql = "Delete ARCHIVOS Where Arch_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    protected void DownloadFile(object sender, EventArgs e)
    {
        int id = int.Parse((sender as LinkButton).CommandArgument);
        byte[] bytes;
        string fileName;
        using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.CommandText = "select NombreArch, Data from  ARCHIVOS where Arch_Id=@Id";
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Connection = con;
                con.Open();
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    sdr.Read();
                    bytes = (byte[])sdr["Data"];
                    fileName = sdr["NombreArch"].ToString();
                }
                con.Close();
            }
        }
        Response.Clear();
        Response.Buffer = true;
        Response.Charset = "";
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
        Response.BinaryWrite(bytes);
        Response.Flush();
        Response.End();
    }

    //SERVIDORES POLICIALES
    private void grados()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Gr_Id, Descripcion FROM GRADOS";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlservpol.ClearSelection();
        ddlservpol.Items.Clear();
        ddlservpol.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlservpol.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Muestragrados()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT SERVPOLICIALES.SP_Id AS sp1, GRADOS.Descripcion AS sp2, SERVPOLICIALES.NombreApellidos AS sp3 FROM GRADOS INNER JOIN SERVPOLICIALES ON GRADOS.Gr_Id = SERVPOLICIALES.Gr_Id WHERE (SERVPOLICIALES.Op_Id = " + Convert.ToInt32(lblidoperativo.Text.Trim()) + ") ORDER BY GRADOS.Gr_Id", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridservpol.DataSource = ds;
        gridservpol.DataBind();
    }
    private void limpiagrados()
    {
        TextBox1.Text = "";
        grados();
        Muestragrados();
        ddlservpol.Focus();
    }
    protected void btnservpoladd_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO SERVPOLICIALES(Op_Id, Gr_Id, NombreApellidos, UpdInf, fechahoraing, Usuario) VALUES (@Op_Id, @Gr_Id, @NombreApellidos, @UpdInf, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Op_Id = new SqlParameter("@Op_Id", SqlDbType.Int);
        Op_Id.Value = Convert.ToInt32(lblidoperativo.Text.Trim());
        cmd.Parameters.Add(Op_Id);
        SqlParameter Gr_Id = new SqlParameter("@Gr_Id", SqlDbType.Int);
        Gr_Id.Value = Convert.ToInt32(ddlservpol.SelectedValue.Trim());
        cmd.Parameters.Add(Gr_Id);
        SqlParameter NombreApellidos = new SqlParameter("@NombreApellidos", SqlDbType.NChar, 150);
        NombreApellidos.Value = TextBox1.Text.Trim().ToUpper();
        cmd.Parameters.Add(NombreApellidos);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiagrados();
    }
    //Jurisdiccion del caso
    protected void btnjurisd_Click(object sender, EventArgs e)
    {
        actualizajuris();
        insertjuris();
        Muestrajuris();
        limpiajuris();
    }
    private void actualizajuris()
    {
        SqlConnection sqlconn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand sqlCmd = new SqlCommand("UPDATE JURISDICCION SET Actual = 0 WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", sqlconn);
        sqlconn.Open();
        sqlCmd.ExecuteNonQuery();
        sqlconn.Close();
    }
    private void insertjuris()
    {
        DateTime ahora = DateTime.Now;
        ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO JURISDICCION(Casos_Id, Fecha, Jurisdiccion, Observacion, Actual, UpdInf, fechahoraing, Usuario) VALUES (@Casos_Id, @Fecha, @Jurisdiccion, @Observacion, @Actual, @UpdInf, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Casos_Id = new SqlParameter("@Casos_Id", SqlDbType.Int);
        Casos_Id.Value = Convert.ToInt32(lblidcaso.Text.Trim());
        cmd.Parameters.Add(Casos_Id);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtfechajuris.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter Jurisdiccion = new SqlParameter("@Jurisdiccion", SqlDbType.NVarChar, 100);
        Jurisdiccion.Value = txtjuris.Text.Trim().ToUpper();
        cmd.Parameters.Add(Jurisdiccion);
        SqlParameter Observacion = new SqlParameter("@Observacion", SqlDbType.NVarChar, 150);
        Observacion.Value = txtobsjuris.Text.Trim().ToUpper();
        cmd.Parameters.Add(Observacion);
        SqlParameter Actual = new SqlParameter("@Actual", SqlDbType.Int);
        Actual.Value = Convert.ToInt32(1);
        cmd.Parameters.Add(Actual);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
    }
    private void limpiajuris()
    {
        txtfechajuris.Text = "";
        txtjuris.Text = "";
        txtobsjuris.Text = "";
        txtfechajuris.Focus();
    }
    private void Muestrajuris()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT Jur_Id AS Jur1, Fecha AS Jur2, Jurisdiccion AS Jur3, Observacion AS Jur4, (CASE WHEN (Actual = 1) THEN 'Actual' ELSE '' END) AS Jur5 FROM JURISDICCION WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridjuris.DataSource = ds;
        gridjuris.DataBind();
    }
    //Control Jurisdiccional
    protected void btncontroljur_Click(object sender, EventArgs e)
    {
        actualizaconjuris();
        insertconjuris();
        Muestraconjuris();
        limpiaconjuris();
    }
    protected void limpiaconjuris()
    {
        txtfechaini.Text = "";
        txtjuzgado.Text = "";
        txtjuzmixto.Text = "";
        txttribunalsen.Text = "";
        txtjuzejepenal.Text = "";
        txtfechaini.Focus();
    }
    protected void Muestraconjuris()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT CJ_Id AS Cj1, Fecha AS Cj2, JuzgadoInst AS Cj3, JuzgadoPart AS Cj4, TribunalSent AS Cj5, JuzgadoEjec AS Cj6, (CASE WHEN (Actual = 1) THEN 'Actual' ELSE '' END) AS Cj7 FROM CONTROLJURISDICCIONAL WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridcontroljuris.DataSource = ds;
        gridcontroljuris.DataBind();
        con.Close();
    }
    protected void actualizaconjuris()
    {
        SqlConnection sqlconn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand sqlCmd = new SqlCommand("UPDATE CONTROLJURISDICCIONAL SET Actual = 0 WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", sqlconn);
        sqlconn.Open();
        sqlCmd.ExecuteNonQuery();
        sqlconn.Close();
    }
    public void insertconjuris()
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO CONTROLJURISDICCIONAL(Casos_Id, Fecha, JuzgadoInst, JuzgadoPart, TribunalSent, JuzgadoEjec, Actual, UpdInf, fechahoraing, Usuario) VALUES (@Casos_Id, @Fecha, @JuzgadoInst, @JuzgadoPart, @TribunalSent, @JuzgadoEjec, @Actual, @UpdInf, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Casos_Id = new SqlParameter("@Casos_Id", SqlDbType.Int);
        Casos_Id.Value = Convert.ToInt32(lblidcaso.Text.Trim());
        cmd.Parameters.Add(Casos_Id);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtfechaini.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter JuzgadoInst = new SqlParameter("@JuzgadoInst", SqlDbType.NVarChar, 100);
        JuzgadoInst.Value = txtjuzgado.Text.Trim().ToUpper();
        cmd.Parameters.Add(JuzgadoInst);
        SqlParameter JuzgadoPart = new SqlParameter("@JuzgadoPart", SqlDbType.NVarChar, 100);
        JuzgadoPart.Value = txtjuzmixto.Text.Trim().ToUpper();
        cmd.Parameters.Add(JuzgadoPart);
        SqlParameter TribunalSent = new SqlParameter("@TribunalSent", SqlDbType.NVarChar, 100);
        TribunalSent.Value = txttribunalsen.Text.Trim().ToUpper();
        cmd.Parameters.Add(TribunalSent);
        SqlParameter JuzgadoEjec = new SqlParameter("@JuzgadoEjec", SqlDbType.NVarChar, 100);
        JuzgadoEjec.Value = txtjuzejepenal.Text.Trim().ToUpper();
        cmd.Parameters.Add(JuzgadoEjec);
        SqlParameter Actual = new SqlParameter("@Actual", SqlDbType.Int);
        Actual.Value = Convert.ToInt32(1);
        cmd.Parameters.Add(Actual);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
    }
    //ASIGNADO AL CASO
    private void Muestraasignado()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT INVESTIGADOR.Inv_Id AS In1, GRADOS.Descripcion AS In2, INVESTIGADOR.NombreApp AS In3, INVESTIGADOR.Fecha AS In4, INVESTIGADOR.TelefonoCel AS In5, INVESTIGADOR.TelefonoFijo AS In6, (CASE WHEN (INVESTIGADOR.Actual = 1) THEN 'Actual' ELSE '' END) AS In7 " +
                                                "FROM INVESTIGADOR INNER JOIN GRADOS ON INVESTIGADOR.Gr_Id = GRADOS.Gr_Id " +                                    
                                                "WHERE (INVESTIGADOR.Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridinvestigador.DataSource = ds;
        gridinvestigador.DataBind();
        con.Close();
    }   
    private void limpiaasignado()
    {
        listagrados();
        txtfechaasignacion.Text = "";        
        txtinvestigador.Text = "";
        txtnrocel.Text = "";
        txtnrofijo.Text = "";
        Muestraasignado();
        ddlgrado.Focus();
    }
    private void listagrados()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT Gr_Id, Descripcion FROM GRADOS ORDER BY Gr_Id";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        ddlgrado.ClearSelection();
        ddlgrado.Items.Clear();
        ddlgrado.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            ddlgrado.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }    
    private void actualizaasignado()
    {
        SqlConnection sqlconn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand sqlCmd = new SqlCommand("UPDATE INVESTIGADOR SET Actual = 0 WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", sqlconn);
        sqlconn.Open();
        sqlCmd.ExecuteNonQuery();
        sqlconn.Close();
    }
    private void insertasignado()
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO INVESTIGADOR(Casos_Id, Usuario, Gr_Id, NombreApp, TelefonoCel, TelefonoFijo, Fecha, Actual, UpdInf, fechahoraing, UsuarioS) VALUES (@Casos_Id, @Usuario, @Gr_Id, @NombreApp, @TelefonoCel, @TelefonoFijo, @Fecha, @Actual, @UpdInf, @fechahoraing, @UsuarioS)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Casos_Id = new SqlParameter("@Casos_Id", SqlDbType.Int);
        Casos_Id.Value = Convert.ToInt32(lblidcaso.Text.Trim());
        cmd.Parameters.Add(Casos_Id);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        SqlParameter Gr_Id = new SqlParameter("@Gr_Id", SqlDbType.Int);
        Gr_Id.Value = Convert.ToInt32(ddlgrado.SelectedValue.Trim());
        cmd.Parameters.Add(Gr_Id);
        SqlParameter NombreApp = new SqlParameter("@NombreApp", SqlDbType.NChar, 200);
        NombreApp.Value = txtinvestigador.Text.Trim().ToUpper();
        cmd.Parameters.Add(NombreApp);
        SqlParameter TelefonoCel = new SqlParameter("@TelefonoCel", SqlDbType.NVarChar, 10);
        TelefonoCel.Value = txtnrocel.Text.Trim().ToUpper();
        cmd.Parameters.Add(TelefonoCel);
        SqlParameter TelefonoFijo = new SqlParameter("@TelefonoFijo", SqlDbType.NVarChar, 10);
        TelefonoFijo.Value = txtnrofijo.Text.Trim().ToUpper();
        cmd.Parameters.Add(TelefonoFijo);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtfechaasignacion.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter Actual = new SqlParameter("@Actual", SqlDbType.Int);
        Actual.Value = Convert.ToInt32(1);
        cmd.Parameters.Add(Actual);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter UsuarioS = new SqlParameter("@UsuarioS", SqlDbType.NChar, 15);
        UsuarioS.Value = pase.Trim();
        cmd.Parameters.Add(UsuarioS);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
    }
    protected void btnasignado_Click(object sender, EventArgs e)
    {
        actualizaasignado();
        insertasignado();
        Muestraasignado();
        limpiaasignado();
    }
    //fiscal asignado
    private void Muestraafiscal()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT Fis_Id AS Fis1, NombreApellidos AS Fis2, Fecha AS Fis3, TelefonoCel AS Fis4, TelefonoFijo AS Fis5,  (CASE WHEN (Actual = 1) THEN 'Actual' ELSE '' END) AS Fis6 FROM FISCAL WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView5.DataSource = ds;
        GridView5.DataBind();
        con.Close();
    }
    private void limpiafiscal()
    {
        txtfisnomb.Text = "";
        txtfisfechaasig.Text = "";
        txtfiscel.Text = "";
        txtfisofi.Text = "";
        Muestraafiscal();
        txtfisnomb.Focus();
    }
    private void actualizafiscal()
    {
        SqlConnection sqlconn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand sqlCmd = new SqlCommand("UPDATE FISCAL SET Actual = 0 WHERE (Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")", sqlconn);
        sqlconn.Open();
        sqlCmd.ExecuteNonQuery();
        sqlconn.Close();
    }
    private void insertfiscal()
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO FISCAL(Casos_Id, NombreApellidos, TelefonoCel, TelefonoFijo, Fecha, Actual, UpdInf, fechahoraing, Usuario) VALUES (@Casos_Id, @NombreApellidos, @TelefonoCel, @TelefonoFijo, @Fecha, @Actual, @UpdInf, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter Casos_Id = new SqlParameter("@Casos_Id", SqlDbType.Int);
        Casos_Id.Value = Convert.ToInt32(lblidcaso.Text.Trim());
        cmd.Parameters.Add(Casos_Id);
        SqlParameter NombreApellidos = new SqlParameter("@NombreApellidos", SqlDbType.NVarChar, 150);
        NombreApellidos.Value = txtfisnomb.Text.Trim().ToUpper();
        cmd.Parameters.Add(NombreApellidos);
        SqlParameter TelefonoCel = new SqlParameter("@TelefonoCel", SqlDbType.NVarChar, 10);
        TelefonoCel.Value = txtfiscel.Text.Trim().ToUpper();
        cmd.Parameters.Add(TelefonoCel);
        SqlParameter TelefonoFijo = new SqlParameter("@TelefonoFijo", SqlDbType.NVarChar, 10);
        TelefonoFijo.Value = txtfisofi.Text.Trim().ToUpper();
        cmd.Parameters.Add(TelefonoFijo);
        SqlParameter Fecha = new SqlParameter("@Fecha", SqlDbType.DateTime);
        Fecha.Value = Convert.ToDateTime(txtfisfechaasig.Text.Trim());
        cmd.Parameters.Add(Fecha);
        SqlParameter Actual = new SqlParameter("@Actual", SqlDbType.Int);
        Actual.Value = Convert.ToInt32(1);
        cmd.Parameters.Add(Actual);
        SqlParameter UpdInf = new SqlParameter("@UpdInf", SqlDbType.NText);
        UpdInf.Value = "";
        cmd.Parameters.Add(UpdInf);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
    }

    protected void btnfiscal_Click(object sender, EventArgs e)
    {
        actualizafiscal();
        insertfiscal();
        Muestraafiscal();
        limpiafiscal();
    }
}