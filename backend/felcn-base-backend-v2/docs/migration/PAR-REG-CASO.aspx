<%@ Page Title="" Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/FELCN-CASOS.master" AutoEventWireup="true" CodeFile="PAR-REG-CASO.aspx.cs" Inherits="FELCN_CASOS_PAR_REG_CASO" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder2" runat="Server">
    <div class="vernav2 iconmenu">
        <ul>
            <li><a href="#formsub" class="editor">CASOS INF. PARALELA</a> <span class="arrow">
            </span>
                <ul id="formsub">
                    <li><a href="PAR-REG-CASO.aspx" class="gallery">Reg. Casos Paralelos</a></li>
                    <li><a href="PAR-ING-CASO.aspx" class="gallery">Casos Paralelos en Analisis</a></li>
                    <li><a href="PAR-JUD-CASO.aspx" class="gallery">Casos Paralelos Judicializados</a></li>
                    <li><a href="PAR-RECH-CASO.aspx" class="gallery">Casos Paralelos Desestimados</a></li>                    
                </ul>
            </li>
        </ul>
        <a class="togglemenu"></a>
        <br />
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="pageheader">
        <h1 class="pagetitle">
            Seleccion del Caso para Investigacion Paralela
        </h1>
        <asp:Label ID="LblUsuario" runat="server" Visible="False"></asp:Label>
        <asp:Label ID="LblUnidad" runat="server" Visible="False"></asp:Label>
        <br />
        <ul id="MenuUl" runat="server" class="breadcrumbs">
        </ul>
    </div>
    <div id="contentwrapper" class="contentwrapper">
        <div id="basicform" class="subcontent">
            <div class="contenttitle2">
                <h3>
                    Lista de Casos</h3>
            </div>
            <!--contenttitle-->
            <table cellpadding="0" cellspacing="0" border="0" class="stdtable">
                <colgroup>
                    <col class="con0" />
                    <col class="con1" />
                </colgroup>
                <thead>
                    <tr>
                        <th class="head0" style="width: 213px">
                            &nbsp;
                        </th>
                        <th class="head1" style="width: 15px">
                            &nbsp;
                        </th>
                        <th class="head1">
                            &nbsp;
                        </th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th class="head0" style="width: 213px">
                            &nbsp;
                        </th>
                        <th class="head1" style="width: 15px">
                            &nbsp;
                        </th>
                        <th class="head1">
                            &nbsp;
                        </th>
                    </tr>
                </tfoot>
                <tbody>
                    <tr>
                        <td class="width50" style="width: 213px">
                            Nombre del caso
                        </td>
                        <td style="width: 15px">
                            <asp:TextBox ID="txtnombcaso" runat="server" Width="200px"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button ID="Button6" runat="server" OnClick="Button6_Click" Text="Buscar" />
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px">
                            Numero de Caso FELCN
                        </td>
                        <td style="width: 15px">
                            <asp:TextBox ID="txtnrocaso" runat="server" Width="200px"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Buscar" />
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px">
                            Numero de Operativo</td>
                        <td style="width: 15px">
                            <asp:TextBox ID="txtnroope" runat="server" Width="200px"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button ID="Button9" runat="server" onclick="Button9_Click" Text="Buscar" />
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px">
                            Numero de Caso Perdida de Dominio
                        </td>
                        <td style="width: 15px">
                            <asp:TextBox ID="txtperddom" runat="server" Width="200px"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button ID="Button8" runat="server" OnClick="Button8_Click" Text="Buscar" />
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px">
                            Investigador</td>
                        <td style="width: 15px">
                            <asp:DropDownList ID="DdlAsignado" runat="server">
                            </asp:DropDownList>
                        </td>
                        <td>
                            <asp:Button ID="Button3" runat="server" Text="Buscar" OnClick="Button3_Click" />
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px">
                            &nbsp;
                            <asp:Label ID="LblIdAsig" runat="server"></asp:Label>
                        </td>
                        <td style="width: 15px">
                            <asp:Button ID="Button7" runat="server" OnClick="Button7_Click" Text="Limpiar Pantalla" />
                        </td>
                        <td>
                            <asp:Button ID="Button5" runat="server" OnClick="Button5_Click" Text="Mostrar Todos" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <asp:GridView ID="GridCasos" runat="server" Width="100%" class="stdtable" AutoGenerateColumns="False"
                                OnSelectedIndexChanged="GridCasos_SelectedIndexChanged" Font-Size="X-Small">
                                <Columns>
                                    <asp:BoundField DataField="Cas1" HeaderText="Id" />
                                    <asp:BoundField DataField="Cas2" HeaderText="Unidad" />
                                    <asp:BoundField DataField="Cas3" HeaderText="Regional" />
                                    <asp:BoundField DataField="Cas4" HeaderText="Nro. de Operativo" />
                                    <asp:BoundField DataField="Cas5" HeaderText="Nombre del Caso" />
                                    <asp:BoundField DataField="Cas6" HeaderText="Nro. Caso FELCN" />
                                    <asp:BoundField DataField="Cas7" HeaderText="Asignado al Caso" />
                                    <asp:BoundField DataField="Cas8" HeaderText="Fiscal Asignado" />
                                    <asp:CommandField ButtonType="Button" SelectText="Selecionar" ShowSelectButton="True" />
                                </Columns>
                            </asp:GridView>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <asp:GridView ID="GridOperativo" runat="server" Width="100%" class="stdtable" AutoGenerateColumns="False"
                                OnSelectedIndexChanged="GridOperativo_SelectedIndexChanged" Font-Size="X-Small">
                                <Columns>
                                    <asp:BoundField DataField="Op1" HeaderText="Id" />
                                    <asp:BoundField DataField="Op2" HeaderText="Nro. de Informe" />
                                    <asp:BoundField DataField="Op3" HeaderText="Fecha Operativo" />
                                    <asp:BoundField DataField="Op4" HeaderText="Lugar Operativo" />
                                    <asp:BoundField DataField="Op5" HeaderText="Unidad" />
                                    <asp:BoundField DataField="Op6" HeaderText="Relacion de Hecho" />
                                    <asp:CommandField ButtonType="Image" SelectImageUrl="~/images/Infomes.png" ShowSelectButton="True" />
                                </Columns>
                            </asp:GridView>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                           <center>
                               <h3>
                                   FORMULARIO DE REGISTRO DE CASO PARALELO</h3>
                            </center></td>
                    </tr>
                    <tr>
                        <td>
                            Nro. de Caso</td>
                        <td>
                            <asp:TextBox ID="txtcasopar" runat="server" Width="150px" Enabled="False"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Label ID="lblidcaso" runat="server"></asp:Label>
&nbsp;<asp:Label ID="lblidope" runat="server"></asp:Label>
                        &nbsp;<asp:Label ID="lbldpto" runat="server"></asp:Label>
&nbsp;<asp:Label ID="lbluni" runat="server"></asp:Label>
&nbsp;<asp:Label ID="lbldis" runat="server"></asp:Label>
&nbsp;<asp:Label ID="lblgrupo" runat="server"></asp:Label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Delito Presedente</td>
                        <td colspan="2">
                            <asp:DropDownList ID="ddldelito" runat="server" Enabled="False">
                                <asp:ListItem>Fabricación (Art. 47 Ley 1008)</asp:ListItem>
                                <asp:ListItem>Transporte (Art. 55 Ley 1008)</asp:ListItem>
                                <asp:ListItem>Tráfico (Art. 48 Ley 1008)</asp:ListItem>
                            </asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td>Asignado al Caso</td>
                        <td colspan="2">
                            <asp:TextBox ID="txtasigpar" runat="server" Width="350px" Enabled="False"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>Fiscal de Sustancias Controladas</td>
                        <td colspan="2">
                            <asp:TextBox ID="txtfispar" runat="server" Width="350px" Enabled="False"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>Delito Presedente</td>
                        <td colspan="2">
                            <asp:TextBox ID="txtinfdelpre" runat="server" Width="100%" Height="350px" 
                                TextMode="MultiLine" Enabled="False"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>Informe de Inteligencia financiera o patrimonial </td>
                        <td colspan="2">
                            <asp:TextBox ID="txtinfinv" runat="server" Width="100%" Height="350px" 
                                TextMode="MultiLine" Enabled="False"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td>Fecha de Envio a Fiscalia</td>
                        <td>
                            <asp:TextBox ID="txtfechapar" runat="server" Width="100px" Enabled="False"></asp:TextBox>
                        </td>
                        <td></td>                        
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <asp:Button ID="Button10" runat="server" onclick="Button10_Click" 
                                Text="Guardar Caso Paralelo" Enabled="False" />
                        </td>
                        <td>&nbsp;</td>                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</asp:Content>
