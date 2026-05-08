<%@ Page Title="" Language="C#" MasterPageFile="~/FELCN-CASOS.master" AutoEventWireup="true" CodeFile="PAR-JUD-CASO.aspx.cs" Inherits="FELCN_CASOS_PAR_JUD_CASO" %>

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
            CASOS PARALELOS
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
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            CASOS CON INVESTIGACION PARALELA JUDICIALIZADOS</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>
                           
                        </th>
                    </tr>
                </tfoot>
                <tbody>
                    <tr>
                        <td>
                            <asp:GridView ID="GridCasos" runat="server" Width="100%" class="stdtable" 
                                AutoGenerateColumns="False" Font-Size="X-Small">
                                <Columns>
                                    <asp:BoundField DataField="ip1" HeaderText="Id" />
                                    <asp:BoundField DataField="ip2" HeaderText="Estado" />
                                    <asp:BoundField DataField="ip3" HeaderText="Departamento" />
                                    <asp:BoundField DataField="ip4" HeaderText="Unidad" />
                                    <asp:BoundField DataField="ip5" HeaderText="Distrital" />
                                    <asp:BoundField DataField="ip6" HeaderText="Grupo" />
                                    <asp:BoundField DataField="ip7" HeaderText="Delito" />
                                    <asp:BoundField DataField="ip8" HeaderText="Nro. de Caso" />
                                    <asp:BoundField DataField="ip9" HeaderText="Investigador Asignado" />
                                    <asp:BoundField DataField="ip10" HeaderText="Fiscal Asignado" />
                                    <asp:BoundField DataField="ip11" HeaderText="Delito Presedente" >
                                    <ItemStyle Font-Size="Smaller" />
                                    </asp:BoundField>
                                    <asp:BoundField DataField="ip12" 
                                        HeaderText="Informe de Investigacion Paralela" >
                                    <ItemStyle Font-Size="Smaller" />
                                    </asp:BoundField>
                                    <asp:BoundField DataField="ip13" HeaderText="Fecha de Envio" />
                                    <asp:BoundField DataField="ip14" HeaderText="Fecha de Respuesta" />
                                </Columns>
                            </asp:GridView>
                        </td>
                    </tr>
                    <tr>
                        <td class="width50" style="width: 213px; height: 38px;">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</asp:Content>

